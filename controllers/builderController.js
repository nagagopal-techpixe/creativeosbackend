import ImageTab         from "../models/ImageTab.js";
import ImageCategory    from "../models/ImageCategory.js";
import BuilderType      from "../models/BuilderType.js";
import BuilderStyle     from "../models/BuilderStyle.js";
import BuilderDetail    from "../models/BuilderDetail.js";
import BuilderRatio     from "../models/BuilderRatio.js";
import ImagePreset      from "../models/ImagePreset.js";
import RecentGeneration from "../models/RecentGeneration.js";

export const getImageTabs         = async (req, res) => { try { res.json(await ImageTab.find());         } catch (e) { res.status(500).json({ message: e.message }) } };
export const getImageCategories   = async (req, res) => { try { res.json(await ImageCategory.find());   } catch (e) { res.status(500).json({ message: e.message }) } };
export const getBuilderTypes      = async (req, res) => { try { res.json(await BuilderType.find());      } catch (e) { res.status(500).json({ message: e.message }) } };
export const getBuilderStyles     = async (req, res) => { try { res.json(await BuilderStyle.find());     } catch (e) { res.status(500).json({ message: e.message }) } };
export const getBuilderDetails    = async (req, res) => { try { res.json(await BuilderDetail.find());    } catch (e) { res.status(500).json({ message: e.message }) } };
export const getBuilderRatios     = async (req, res) => { try { res.json(await BuilderRatio.find());     } catch (e) { res.status(500).json({ message: e.message }) } };
export const getImagePresets      = async (req, res) => { try { res.json(await ImagePreset.find());      } catch (e) { res.status(500).json({ message: e.message }) } };
export const getRecentGenerations = async (req, res) => { try { res.json(await RecentGeneration.find()); } catch (e) { res.status(500).json({ message: e.message }) } };