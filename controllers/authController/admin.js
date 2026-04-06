// controllers/adminController.js
import User             from "../../models/UserModel/User.js";
import Admin            from "../../models/AdminModel/Admin.js";
import bcrypt           from "bcryptjs";
import crypto           from "crypto";
import { sendWelcomeEmail } from "../../utils/sendEmail.js";

import VideoBuilder      from "../../models/VideoBuilder.js";
import VoiceBuilder      from "../../models/VoiceBuilder.js";
import CharacterBuilder  from "../../models/CharacterBuilder.js";
import MusicBuilder      from "../../models/MusicBuilder.js";      // ✅ was missing
import StoryboardBuilder from "../../models/StoryboardBuilder.js";
import ImageBuilder from "../../models/ImageBuilder.js";
export const createUser = async (req, res) => {
  const { name, email } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const generatePassword = (name) => {
      const firstName  = name.split(" ")[0];
      const cleanName  = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
      const randomPart = crypto.randomBytes(2).toString("hex");
      const number     = Math.floor(Math.random() * 90 + 10);
      const symbols    = ["@", "#", "$", "!", "&", "*", "^", "%"];
      const special    = symbols[Math.floor(Math.random() * symbols.length)];
      return `${cleanName}${special}${number}${randomPart}`;
    };

    const plainPassword = generatePassword(name);
    const hashed        = await bcrypt.hash(plainPassword, 10);

const [vb, vo, cb, mb, sb, ib] = await Promise.all([
  VideoBuilder.findOne(),
  VoiceBuilder.findOne(),
  CharacterBuilder.findOne(),
  MusicBuilder.findOne(),
  StoryboardBuilder.findOne(),
  ImageBuilder.findOne(),       // ✅ add
]);


    const defaultPermissions = {
      ...(sb ? {
  storyboardBuilder: {
    types:   { isActive: true, allowedItems: sb.types.items.map(i => i._id) },
    styles:  { isActive: true, allowedItems: sb.styles.items.map(i => i._id) },
    frames:  { isActive: true, allowedItems: sb.frames.items.map(i => i._id) },
    ratios:  { isActive: true, allowedItems: sb.ratios.items.map(i => i._id) },
    presets: { isActive: true, allowedItems: sb.presets.items.map(i => i._id) },
    details: {
      isActive:      true,
      allowedGroups: sb.details.items.map(g => g._id),
      allowedOpts:   Object.fromEntries(
        sb.details.items.map(g => [g._id.toString(), g.opts.map(o => o._id)])
      ),
    },
  },
} : {}),
...(ib ? {
imageBuilder: {
  tabs:              { isActive: true, allowedItems: ib.tabs.items.map(i => i._id) },
  recentGenerations: { isActive: true, allowedItems: ib.recentGenerations.items.map(i => i._id) },
  types:             { isActive: true, allowedItems: ib.types.items.map(i => i._id) },
  styles:            { isActive: true, allowedItems: ib.styles.items.map(i => i._id) },
  ratios:            { isActive: true, allowedItems: ib.ratios.items.map(i => i._id) },
  presets:           { isActive: true, allowedItems: [] },

  // ✅ categories has groups with items inside
  categories: {
    isActive:      true,
    allowedGroups: ib.categories.items.map(g => g._id),
    allowedOpts:   Object.fromEntries(
      ib.categories.items.map(g => [g._id.toString(), g.items.map(i => i._id)])
    ),
  },

  details: {
    isActive:      true,
    allowedGroups: ib.details.items.map(g => g._id),
    allowedOpts:   Object.fromEntries(
      ib.details.items.map(g => [g._id.toString(), g.opts.map(o => o._id)])
    ),
  },
},
} : {}),
      ...(vb ? {
        videoBuilder: {
          types:     { isActive: true, allowedItems: vb.types.items.map(i => i._id) },
          styles:    { isActive: true, allowedItems: vb.styles.items.map(i => i._id) },
          durations: { isActive: true, allowedItems: vb.durations.items.map(i => i._id) },
          formats:   { isActive: true, allowedItems: vb.formats.items.map(i => i._id) },
          hooks:     { isActive: true, allowedItems: vb.hooks.items.map(i => i._id) },
          presets:   { isActive: true, allowedItems: [] },
          details: {
            isActive:      true,
            allowedGroups: vb.details.items.map(g => g._id),
            allowedOpts:   Object.fromEntries(
              vb.details.items.map(g => [g._id.toString(), g.opts.map(o => o._id)])
            ),
          },
        },
      } : {}),
...(cb ? {
  characterBuilder: {
    types:   { isActive: true, allowedItems: cb.types.items.map(i => i._id) },
    styles:  { isActive: true, allowedItems: cb.styles.items.map(i => i._id) },
    poses:   { isActive: true, allowedItems: cb.poses.items.map(i => i._id) },  // ✅
    presets: { isActive: true, allowedItems: [] },
    details: {
      isActive:      true,
      allowedGroups: cb.details.items.map(g => g._id),
      allowedOpts:   Object.fromEntries(
        cb.details.items.map(g => [g._id.toString(), g.opts.map(o => o._id)])
      ),
    },
  },
} : {}),
...(mb ? {
  musicBuilder: {
    types:     { isActive: true, allowedItems: mb.types.items.map(i => i._id) },
    genres:    { isActive: true, allowedItems: mb.genres.items.map(i => i._id) },
    durations: { isActive: true, allowedItems: mb.durations.items.map(i => i._id) },
    presets:   { isActive: true, allowedItems: [] },
    details: {
      isActive:      true,
      allowedGroups: mb.details.items.map(g => g._id),
      allowedOpts:   Object.fromEntries(
        mb.details.items.map(g => [g._id.toString(), g.opts.map(o => o._id)])
      ),
    },
  },
} : {}),

      ...(vo ? {
        voiceBuilder: {
          types:  { isActive: true, allowedItems: vo.types.items.map(i => i._id) },
          tones:  { isActive: true, allowedItems: vo.tones.items.map(i => i._id) },
          pacing: { isActive: true, allowedItems: vo.pacing.items.map(i => i._id) },
        },
      } : {}),
    };

    const user = await User.create({
      name,
      email,
      password:    hashed,
      createdBy:   req.admin._id,
      permissions: defaultPermissions,
    });

    try {
      const admin = await Admin.findById(req.admin._id).select("name");
      await sendWelcomeEmail(email, name, plainPassword, admin?.name ?? "Admin");
    } catch (mailError) {
      console.error("Failed to send welcome email:", mailError.message);
    }

    res.status(201).json({
      _id:       user._id,
      name:      user.name,
      email:     user.email,
      role:      user.role,
      createdBy: user.createdBy,
      message:   "User created successfully. Credentials sent to email.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("createdBy", "name email");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyUsers = async (req, res) => {
  try {
    const users = await User.find({ createdBy: req.admin._id })
      .select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET a user's current permissions
export const getUserPermissions = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("name email permissions");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH save user permissions
export const updateUserPermissions = async (req, res) => {
  const { builderKey, sectionKey, sectionData } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { [`permissions.${builderKey}.${sectionKey}`]: sectionData } },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ permissions: user.permissions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── VIDEO PERMISSIONS ───────────────────────────────────────────

export const toggleVideoSection = async (req, res) => {
  const { id, section } = req.params;
  const { isActive } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { [`permissions.videoBuilder.${section}.isActive`]: isActive } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ isActive: user.permissions.videoBuilder[section].isActive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleVideoItem = async (req, res) => {
  const { id, section, itemId } = req.params;
  const { isActive } = req.body;
  
  // Debug logging to identify the issue
  console.log('toggleVideoItem called with:', {
    id,
    section,
    itemId,
    isActive,
    params: req.params,
    body: req.body
  });
  
  try {
    const update = isActive
      ? { $addToSet: { [`permissions.videoBuilder.${section}.allowedItems`]: itemId } }
      : { $pull:     { [`permissions.videoBuilder.${section}.allowedItems`]: itemId } };

    console.log('MongoDB update operation:', update);

    const user = await User.findByIdAndUpdate(id, update, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    
    console.log('Updated allowedItems:', user.permissions.videoBuilder[section].allowedItems);
    
    res.json({ allowedItems: user.permissions.videoBuilder[section].allowedItems });
  } catch (error) {
    console.error('Error in toggleVideoItem:', error);
    res.status(500).json({ message: error.message });
  }
};

// ─── VOICE PERMISSIONS ───────────────────────────────────────────

export const toggleVoiceSection = async (req, res) => {
  const { id, section } = req.params;
  const { isActive } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { [`permissions.voiceBuilder.${section}.isActive`]: isActive } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ isActive: user.permissions.voiceBuilder[section].isActive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleVoiceItem = async (req, res) => {
  const { id, section, itemId } = req.params;
  const { isActive } = req.body;
  try {
    const update = isActive
      ? { $addToSet: { [`permissions.voiceBuilder.${section}.allowedItems`]: itemId } }
      : { $pull:     { [`permissions.voiceBuilder.${section}.allowedItems`]: itemId } };

    const user = await User.findByIdAndUpdate(id, update, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ allowedItems: user.permissions.voiceBuilder[section].allowedItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const toggleVideoDetailsSection = async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { "permissions.videoBuilder.details.isActive": isActive } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ isActive: user.permissions.videoBuilder.details.isActive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ NEW — works correctly even when allowedGroups is empty
export const toggleVideoDetailsGroup = async (req, res) => {
  const { id, groupId } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const currentAllowed = user.permissions.videoBuilder.details.allowedGroups.map(String);
    let newAllowed;
    if (currentAllowed.length === 0) {
      const vb = await VideoBuilder.findOne();
      const all = vb.details.items.map(g => String(g._id));
      newAllowed = all.filter(id => id !== groupId);
    } else {
      const isAllowed = currentAllowed.includes(groupId);
      newAllowed = isAllowed
        ? currentAllowed.filter(id => id !== groupId)
        : [...currentAllowed, groupId];
    }

    user.permissions.videoBuilder.details.allowedGroups = newAllowed;
    user.markModified("permissions.videoBuilder.details.allowedGroups");
    await user.save();
    res.json({ allowedGroups: newAllowed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleVideoDetailsOpt = async (req, res) => {
  const { id, groupId, optId } = req.params;
  const { isActive } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const allowedOpts = user.permissions.videoBuilder.details.allowedOpts ?? {};
    const currentArr  = (allowedOpts[groupId] ?? []).map(String);

    const newArr = isActive
      ? [...new Set([...currentArr, optId])]
      : currentArr.filter((id) => id !== optId);

    allowedOpts[groupId] = newArr;

    user.permissions.videoBuilder.details.allowedOpts = allowedOpts;
    user.markModified("permissions.videoBuilder.details.allowedOpts"); // ✅
    await user.save();

    res.json({ allowedOpts: user.permissions.videoBuilder.details.allowedOpts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── CHARACTER PERMISSIONS ───────────────────────────────────────────

export const toggleCharacterSection = async (req, res) => {
  const { id, section } = req.params;
  const { isActive } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { [`permissions.characterBuilder.${section}.isActive`]: isActive } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ isActive: user.permissions.characterBuilder[section].isActive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleCharacterItem = async (req, res) => {
  const { id, section, itemId } = req.params;
  const { isActive } = req.body;
  try {
    const update = isActive
      ? { $addToSet: { [`permissions.characterBuilder.${section}.allowedItems`]: itemId } }
      : { $pull:     { [`permissions.characterBuilder.${section}.allowedItems`]: itemId } };

    const user = await User.findByIdAndUpdate(id, update, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ allowedItems: user.permissions.characterBuilder[section].allowedItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleCharacterDetailsSection = async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { "permissions.characterBuilder.details.isActive": isActive } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ isActive: user.permissions.characterBuilder.details.isActive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleCharacterDetailsGroup = async (req, res) => {
  const { id, groupId } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const currentAllowed = user.permissions.characterBuilder.details.allowedGroups.map(String);
    let newAllowed;
    if (currentAllowed.length === 0) {
      const cb = await CharacterBuilder.findOne();
      const all = cb.details.items.map(g => String(g._id));
      newAllowed = all.filter(id => id !== groupId);
    } else {
      const isAllowed = currentAllowed.includes(groupId);
      newAllowed = isAllowed
        ? currentAllowed.filter(id => id !== groupId)
        : [...currentAllowed, groupId];
    }

    user.permissions.characterBuilder.details.allowedGroups = newAllowed;
    user.markModified("permissions.characterBuilder.details.allowedGroups");
    await user.save();
    res.json({ allowedGroups: newAllowed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleCharacterDetailsOpt = async (req, res) => {
  const { id, groupId, optId } = req.params;
  const { isActive } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Manually update Mixed field
    const allowedOpts = user.permissions.characterBuilder.details.allowedOpts ?? {};
    const currentArr  = (allowedOpts[groupId] ?? []).map(String);

    const newArr = isActive
      ? [...new Set([...currentArr, optId])]     // add
      : currentArr.filter((id) => id !== optId); // remove

    allowedOpts[groupId] = newArr;

    user.permissions.characterBuilder.details.allowedOpts = allowedOpts;
    user.markModified("permissions.characterBuilder.details.allowedOpts"); // ✅ tell Mongoose Mixed changed
    await user.save();

    res.json({ allowedOpts: user.permissions.characterBuilder.details.allowedOpts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── MUSIC PERMISSIONS ─────────────────────────────────────────

export const toggleMusicSection = async (req, res) => {
  const { id, section } = req.params;
  const { isActive } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { [`permissions.musicBuilder.${section}.isActive`]: isActive } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ isActive: user.permissions?.musicBuilder?.[section]?.isActive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleMusicItem = async (req, res) => {
  const { id, section, itemId } = req.params;
  const { isActive } = req.body;
  try {
    const update = isActive
      ? { $addToSet: { [`permissions.musicBuilder.${section}.allowedItems`]: itemId } }
      : { $pull:     { [`permissions.musicBuilder.${section}.allowedItems`]: itemId } };

    const user = await User.findByIdAndUpdate(id, update, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ allowedItems: user.permissions?.musicBuilder?.[section]?.allowedItems ?? [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleMusicDetailsSection = async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { "permissions.musicBuilder.details.isActive": isActive } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ isActive: user.permissions?.musicBuilder?.details?.isActive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleMusicDetailsGroup = async (req, res) => {
  const { id, groupId } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const currentAllowed =
      (user.permissions?.musicBuilder?.details?.allowedGroups ?? []).map(String);

    const isAllowed = currentAllowed.includes(groupId);

    const newAllowed = isAllowed
      ? currentAllowed.filter((gid) => gid !== groupId)
      : [...currentAllowed, groupId];

    user.permissions.musicBuilder.details.allowedGroups = newAllowed;

    user.markModified("permissions.musicBuilder.details.allowedGroups");
    await user.save();

    res.json({ allowedGroups: newAllowed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleMusicDetailsOpt = async (req, res) => {
  const { id, groupId, optId } = req.params;
  const { isActive } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const allowedOpts =
  user.permissions?.musicBuilder?.details?.allowedOpts ?? {};
    const currentArr  = (allowedOpts[groupId] ?? []).map(String);

    const newArr = isActive
      ? [...new Set([...currentArr, optId])]
      : currentArr.filter((id) => id !== optId);

    allowedOpts[groupId] = newArr;
    user.permissions.musicBuilder.details.allowedOpts = allowedOpts;
    user.markModified("permissions.musicBuilder.details.allowedOpts"); // ✅ Mixed field
    await user.save();

    res.json({ allowedOpts: user.permissions.musicBuilder.details.allowedOpts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ─── STORYBOARD PERMISSIONS ─────────────────────────────────────

export const toggleStoryboardSection = async (req, res) => {
  const { id, section } = req.params;
  const { isActive } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { [`permissions.storyboardBuilder.${section}.isActive`]: isActive } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ isActive: user.permissions?.storyboardBuilder?.[section]?.isActive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleStoryboardItem = async (req, res) => {
  const { id, section, itemId } = req.params;
  const { isActive } = req.body;
  try {
    const update = isActive
      ? { $addToSet: { [`permissions.storyboardBuilder.${section}.allowedItems`]: itemId } }
      : { $pull:     { [`permissions.storyboardBuilder.${section}.allowedItems`]: itemId } };

    const user = await User.findByIdAndUpdate(id, update, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ allowedItems: user.permissions?.storyboardBuilder?.[section]?.allowedItems ?? [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleStoryboardDetailsSection = async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { "permissions.storyboardBuilder.details.isActive": isActive } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ isActive: user.permissions?.storyboardBuilder?.details?.isActive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleStoryboardDetailsGroup = async (req, res) => {
  const { id, groupId } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const currentAllowed = user.permissions.storyboardBuilder.details.allowedGroups.map(String);
    let newAllowed;
    if (currentAllowed.length === 0) {
      const sb = await StoryboardBuilder.findOne();
      const all = sb.details.items.map(g => String(g._id));
      newAllowed = all.filter(id => id !== groupId);
    } else {
      const isAllowed = currentAllowed.includes(groupId);
      newAllowed = isAllowed
        ? currentAllowed.filter(id => id !== groupId)
        : [...currentAllowed, groupId];
    }

    user.permissions.storyboardBuilder.details.allowedGroups = newAllowed;
    user.markModified("permissions.storyboardBuilder.details.allowedGroups");
    await user.save();
    res.json({ allowedGroups: newAllowed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleStoryboardDetailsOpt = async (req, res) => {
  const { id, groupId, optId } = req.params;
  const { isActive } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const allowedOpts = user.permissions.storyboardBuilder.details.allowedOpts ?? {};
    const currentArr  = (allowedOpts[groupId] ?? []).map(String);

    const newArr = isActive
      ? [...new Set([...currentArr, optId])]
      : currentArr.filter((id) => id !== optId);

    allowedOpts[groupId] = newArr;
    user.permissions.storyboardBuilder.details.allowedOpts = allowedOpts;
    user.markModified("permissions.storyboardBuilder.details.allowedOpts"); // ✅ Mixed
    await user.save();

    res.json({ allowedOpts: user.permissions.storyboardBuilder.details.allowedOpts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ─── IMAGE PERMISSIONS ─────────────────────────────────────────

export const toggleImageSection = async (req, res) => {
  const { id, section } = req.params;
  const { isActive } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { [`permissions.imageBuilder.${section}.isActive`]: isActive } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ isActive: user.permissions?.imageBuilder?.[section]?.isActive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleImageItem = async (req, res) => {
  const { id, section, itemId } = req.params;
  const { isActive } = req.body;
  try {
    const update = isActive
      ? { $addToSet: { [`permissions.imageBuilder.${section}.allowedItems`]: itemId } }
      : { $pull:     { [`permissions.imageBuilder.${section}.allowedItems`]: itemId } };

    const user = await User.findByIdAndUpdate(id, update, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ allowedItems: user.permissions?.imageBuilder?.[section]?.allowedItems ?? [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleImageDetailsSection = async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { "permissions.imageBuilder.details.isActive": isActive } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ isActive: user.permissions?.imageBuilder?.details?.isActive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleImageDetailsGroup = async (req, res) => {
  const { id, groupId } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const currentAllowed = user.permissions.imageBuilder.details.allowedGroups.map(String);
    let newAllowed;
    if (currentAllowed.length === 0) {
      const ib = await ImageBuilder.findOne();
      const all = ib.details.items.map(g => String(g._id));
      newAllowed = all.filter(id => id !== groupId);
    } else {
      const isAllowed = currentAllowed.includes(groupId);
      newAllowed = isAllowed
        ? currentAllowed.filter(id => id !== groupId)
        : [...currentAllowed, groupId];
    }

    user.permissions.imageBuilder.details.allowedGroups = newAllowed;
    user.markModified("permissions.imageBuilder.details.allowedGroups");
    await user.save();
    res.json({ allowedGroups: newAllowed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const toggleImageDetailsOpt = async (req, res) => {
  const { id, groupId, optId } = req.params;
  const { isActive } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const allowedOpts = user.permissions.imageBuilder.details.allowedOpts ?? {};
    const currentArr  = (allowedOpts[groupId] ?? []).map(String);

    const newArr = isActive
      ? [...new Set([...currentArr, optId])]
      : currentArr.filter((id) => id !== optId);

    allowedOpts[groupId] = newArr;
    user.permissions.imageBuilder.details.allowedOpts = allowedOpts;
    user.markModified("permissions.imageBuilder.details.allowedOpts");
    await user.save();

    res.json({ allowedOpts: user.permissions.imageBuilder.details.allowedOpts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleImageCategoriesSection = async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { "permissions.imageBuilder.categories.isActive": isActive } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ isActive: user.permissions?.imageBuilder?.categories?.isActive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleImageCategoriesGroup = async (req, res) => {
  const { id, groupId } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const currentAllowed = user.permissions.imageBuilder.categories.allowedGroups.map(String);
    let newAllowed;
    if (currentAllowed.length === 0) {
      const ib = await ImageBuilder.findOne();
      const all = ib.categories.items.map(g => String(g._id));
      newAllowed = all.filter(id => id !== groupId);
    } else {
      const isAllowed = currentAllowed.includes(groupId);
      newAllowed = isAllowed
        ? currentAllowed.filter(id => id !== groupId)
        : [...currentAllowed, groupId];
    }

    user.permissions.imageBuilder.categories.allowedGroups = newAllowed;
    user.markModified("permissions.imageBuilder.categories.allowedGroups");
    await user.save();
    res.json({ allowedGroups: newAllowed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleImageCategoriesItem = async (req, res) => {
  const { id, groupId, itemId } = req.params;
  const { isActive } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const allowedOpts = user.permissions.imageBuilder.categories.allowedOpts ?? {};
    const currentArr  = (allowedOpts[groupId] ?? []).map(String);

    const newArr = isActive
      ? [...new Set([...currentArr, itemId])]
      : currentArr.filter((id) => id !== itemId);

    allowedOpts[groupId] = newArr;
    user.permissions.imageBuilder.categories.allowedOpts = allowedOpts;
    user.markModified("permissions.imageBuilder.categories.allowedOpts");
    await user.save();

    res.json({ allowedOpts: user.permissions.imageBuilder.categories.allowedOpts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};