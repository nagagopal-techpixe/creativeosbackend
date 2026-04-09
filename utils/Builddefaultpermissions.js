// utils/buildDefaultPermissions.js

const activeItems = (items) =>
  items.filter((i) => i.isActive).map((i) => i._id);

const activeGroups = (items) =>
  items.filter((g) => g.isActive).map((g) => g._id);

const activeOpts = (items) =>
  Object.fromEntries(
    items
      .filter((g) => g.isActive)
      .map((g) => [g._id.toString(), g.opts.filter((o) => o.isActive).map((o) => o._id)])
  );

const activeCategoryOpts = (items) =>
  Object.fromEntries(
    items
      .filter((g) => g.isActive)
      .map((g) => [g._id.toString(), g.items.filter((i) => i.isActive).map((i) => i._id)])
  );

export const buildDefaultPermissions = ({ vb, vo, cb, mb, sb, ib, nc } = {}) => {
  const permissions = {};

  // ─── NAV ────────────────────────────────────────────────────────
  if (nc) {
    permissions.navItems = {
      isActive:     nc.navItems.isActive,
      allowedItems: activeItems(nc.navItems.items),
    };
  }

  // ─── VIDEO BUILDER ──────────────────────────────────────────────
  if (vb) {
    permissions.videoBuilder = {
      types:     { isActive: vb.types.isActive,     allowedItems: activeItems(vb.types.items) },
      styles:    { isActive: vb.styles.isActive,    allowedItems: activeItems(vb.styles.items) },
      durations: { isActive: vb.durations.isActive, allowedItems: activeItems(vb.durations.items) },
      formats:   { isActive: vb.formats.isActive,   allowedItems: activeItems(vb.formats.items) },
      hooks:     { isActive: vb.hooks.isActive,     allowedItems: activeItems(vb.hooks.items) },
      presets:   { isActive: vb.presets.isActive,   allowedItems: [] },
      details: {
        isActive:      vb.details.isActive,
        allowedGroups: activeGroups(vb.details.items),
        allowedOpts:   activeOpts(vb.details.items),
      },
    };
  }

  // ─── VOICE BUILDER ──────────────────────────────────────────────
  if (vo) {
    permissions.voiceBuilder = {
      types:  { isActive: vo.types.isActive,  allowedItems: activeItems(vo.types.items) },
      tones:  { isActive: vo.tones.isActive,  allowedItems: activeItems(vo.tones.items) },
      pacing: { isActive: vo.pacing.isActive, allowedItems: activeItems(vo.pacing.items) },
    };
  }

  // ─── CHARACTER BUILDER ──────────────────────────────────────────
  if (cb) {
    permissions.characterBuilder = {
      types:   { isActive: cb.types.isActive,   allowedItems: activeItems(cb.types.items) },
      styles:  { isActive: cb.styles.isActive,  allowedItems: activeItems(cb.styles.items) },
      poses:   { isActive: cb.poses.isActive,   allowedItems: activeItems(cb.poses.items) },
      presets: { isActive: cb.presets.isActive, allowedItems: [] },
      details: {
        isActive:      cb.details.isActive,
        allowedGroups: activeGroups(cb.details.items),
        allowedOpts:   activeOpts(cb.details.items),
      },
    };
  }

  // ─── MUSIC BUILDER ──────────────────────────────────────────────
  if (mb) {
    permissions.musicBuilder = {
      types:     { isActive: mb.types.isActive,     allowedItems: activeItems(mb.types.items) },
      genres:    { isActive: mb.genres.isActive,    allowedItems: activeItems(mb.genres.items) },
      durations: { isActive: mb.durations.isActive, allowedItems: activeItems(mb.durations.items) },
      presets:   { isActive: mb.presets.isActive,   allowedItems: [] },
      details: {
        isActive:      mb.details.isActive,
        allowedGroups: activeGroups(mb.details.items),
        allowedOpts:   activeOpts(mb.details.items),
      },
    };
  }

  // ─── STORYBOARD BUILDER ─────────────────────────────────────────
  if (sb) {
    permissions.storyboardBuilder = {
      types:   { isActive: sb.types.isActive,   allowedItems: activeItems(sb.types.items) },
      styles:  { isActive: sb.styles.isActive,  allowedItems: activeItems(sb.styles.items) },
      frames:  { isActive: sb.frames.isActive,  allowedItems: activeItems(sb.frames.items) },
      ratios:  { isActive: sb.ratios.isActive,  allowedItems: activeItems(sb.ratios.items) },
      presets: { isActive: sb.presets.isActive, allowedItems: [] },
      details: {
        isActive:      sb.details.isActive,
        allowedGroups: activeGroups(sb.details.items),
        allowedOpts:   activeOpts(sb.details.items),
      },
    };
  }

  // ─── IMAGE BUILDER ──────────────────────────────────────────────
  if (ib) {
    permissions.imageBuilder = {
      tabs:              { isActive: ib.tabs.isActive,              allowedItems: activeItems(ib.tabs.items) },
      recentGenerations: { isActive: ib.recentGenerations.isActive, allowedItems: activeItems(ib.recentGenerations.items) },
      types:             { isActive: ib.types.isActive,             allowedItems: activeItems(ib.types.items) },
      styles:            { isActive: ib.styles.isActive,            allowedItems: activeItems(ib.styles.items) },
      ratios:            { isActive: ib.ratios.isActive,            allowedItems: activeItems(ib.ratios.items) },
      presets:           { isActive: ib.presets.isActive,           allowedItems: [] },
      categories: {
        isActive:      ib.categories.isActive,
        allowedGroups: activeGroups(ib.categories.items),
        allowedOpts:   activeCategoryOpts(ib.categories.items),
      },
      details: {
        isActive:      ib.details.isActive,
        allowedGroups: activeGroups(ib.details.items),
        allowedOpts:   activeOpts(ib.details.items),
      },
    };
  }

  return permissions;
};