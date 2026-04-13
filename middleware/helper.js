import VideoBuilderModel from '../models/VideoBuilder.js';
import CharacterBuilderModel from '../models/CharacterBuilder.js';
import ImageBuilderModel from '../models/ImageBuilder.js';
import VoiceBuilderModel from '../models/VoiceBuilder.js';
import MusicBuilderModel from '../models/MusicBuilder.js';
import StoryboardBuilderModel from '../models/StoryboardBuilder.js';
import User from '../models/UserModel/User.js';
import navModel from '../models/NavConfig.js'

// builderName → which collection to query
const collectionMap = {
  videoBuilder:      VideoBuilderModel,
  characterBuilder:  CharacterBuilderModel,
  imageBuilder:      ImageBuilderModel,
  voiceBuilder:      VoiceBuilderModel,
  musicBuilder:      MusicBuilderModel,
  storyboardBuilder: StoryboardBuilderModel,
  navItems:          navModel
};

export const getBuilderData = async (req, res) => {
  try {
    const { builderName } = req.params;
    const userId = req.user._id;

    // 1. Validate builder name
    const Model = collectionMap[builderName];
    if (!Model) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid builder name" 
      });
    }

    // 2. Get the full builder document (one query)
    const builderDoc = await Model.findOne();
    if (!builderDoc) {
      return res.status(404).json({ 
        success: false,
        message: "Builder data not found" 
      });
    }

    // 3. Get user with permissions
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    //4. Check if user has permissions for this builder
    const perms = user.permissions?.[builderName];
    if (!perms) {
      return res.status(403).json({ 
        success: false,
        message: "No access to this builder" 
      });
    }

    const result = {};
    const builderData = builderDoc.toObject();

    // 5. Special handling for navItems
    if (builderName === 'navItems') {
      const navItemsData = builderData.navItems || {};
      //console.log('NavItems data from DB:', JSON.stringify(navItemsData, null, 2));
      //console.log('User permissions:', perms);
      
      if (!perms || !perms.isActive) {
        //console.log('Permissions not active or missing');
        result.navItems = { isActive: false, items: [] };
      } else if (perms.allowedItems) {
        const allowedIds = perms.allowedItems.map(id => id.toString());
        //console.log('Allowed IDs:', allowedIds);
        
        // navItemsData is now directly an object with an "items" array
        const actualNavItems = navItemsData.items || [];
        //console.log('Actual nav items:', actualNavItems.map(item => ({ id: item._id?.toString(), item })));
        
        const filteredItems = actualNavItems.filter(item => 
          item && item._id && allowedIds.includes(item._id.toString())
        );
        //console.log('Filtered items:', filteredItems);
        result.navItems = {
          isActive: true,
          items: filteredItems
        };
      } else {
        //console.log('No allowedItems in permissions');
        result.navItems = { isActive: false, items: [] };
      }
    } else {
      // 5. Handle each submodule (for other builders)
      for (const [subModule, subData] of Object.entries(builderData)) {
        // Skip system fields
        if (subModule === '_id' || subModule === '__v') continue;

        // Skip if subData doesn't have items
        if (!subData || !subData.items) {
          result[subModule] = { isActive: false, items: [] };
          continue;
        }

        const perm = perms[subModule];

        // Submodule not in permissions or not active
        if (!perm || !perm.isActive) {
          result[subModule] = { isActive: false, items: [] };
          continue;
        }

        // ---- "details" is special: has groups + opts ----
        if (subModule === 'details') {
          if (!perm.allowedGroups || !perm.allowedOpts) {
            result[subModule] = { isActive: false, items: [] };
            continue;
          }

          const allowedGroupIds = perm.allowedGroups.map(id => id.toString());
          const allowedOpts = perm.allowedOpts;

          const filteredGroups = subData.items
            .filter(group => group && group._id && allowedGroupIds.includes(group._id.toString()))
            .map(group => {
              const groupId = group._id.toString();
              const allowedOptIds = (allowedOpts[groupId] || []).map(id => id.toString());

              const filteredOpts = (group.opts || []).filter(opt =>
                opt && opt._id && allowedOptIds.includes(opt._id.toString())
              );

              return { ...group, opts: filteredOpts };
            });

          result[subModule] = {
            isActive: true,
            items: filteredGroups
          };

        // ---- "categories" in imageBuilder: has groups + opts too ----
        } else if (subModule === 'categories' && builderName === 'imageBuilder') {
          if (!perm.allowedGroups || !perm.allowedOpts) {
            result[subModule] = { isActive: false, items: [] };
            continue;
          }

          const allowedGroupIds = perm.allowedGroups.map(id => id.toString());
          const allowedOpts = perm.allowedOpts;

          const filteredGroups = subData.items
            .filter(group => group && group._id && allowedGroupIds.includes(group._id.toString()))
            .map(group => {
              const groupId = group._id.toString();
              const allowedOptIds = (allowedOpts[groupId] || []).map(id => id.toString());
              
              const filteredItems = (group.items || []).filter(item =>
                item && item._id && allowedOptIds.includes(item._id.toString())
              );
              
              return { ...group, items: filteredItems };
            });

          result[subModule] = { isActive: true, items: filteredGroups };

        // ---- Normal submodules: types, styles, durations, etc. ----
        } else if (perm.allowedItems) {
          const allowedIds = perm.allowedItems.map(id => id.toString());

          const filteredItems = subData.items.filter(item => 
            item && item._id && allowedIds.includes(item._id.toString())
          );

          result[subModule] = {
            isActive: true,
            items: filteredItems
          };
        } else {
          result[subModule] = { isActive: false, items: [] };
        }
      }
    }

    return res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error in getBuilderData:', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};