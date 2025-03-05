import joi from 'joi';
import React from 'react';
import GapGeniusIcon from './gap-genius-icon.js';
import cloneDeep from '@educandu/educandu/utils/clone-deep.js';
import { PLUGIN_GROUP } from '@educandu/educandu/domain/constants.js';
import { couldAccessUrlFromRoom } from '@educandu/educandu/utils/source-utils.js';
import GithubFlavoredMarkdown from '@educandu/educandu/common/github-flavored-markdown.js';

class GapGeniusInfo {
  static dependencies = [GithubFlavoredMarkdown];

  static typeName = 'musikisum/educandu-plugin-gap-genius';

  constructor(gfm) {
    this.gfm = gfm;
  }

  getDisplayName(t) {
    return t('musikisum/educandu-plugin-gap-genius:name');
  }

  getIcon() {
    return <GapGeniusIcon />;
  }

  getGroups() {
    return [PLUGIN_GROUP.interactive, PLUGIN_GROUP.textImage];
  }

  async resolveDisplayComponent() {
    return (await import('./gap-genius-display.js')).default;
  }

  async resolveEditorComponent() {
    return (await import('./gap-genius-editor.js')).default;
  }

  getDefaultContent() {
    return {
      width: 100,
      text: '',
      cacheText: '',
      footnotes: false,
      showExample: false,
      showFillIns: false,
      replacements: []
    };
  }

  validateContent(content) {
    const replacementSchema = joi.object({
      index: joi.alternatives().try(joi.number().integer().required(), joi.array().length(0)),
      expression: joi.string().required(),
      gaptext: joi.string().allow(''),
      list: joi.array().items(joi.string().allow('')).default([]).required()
    });
    const schema = joi.object({
      width: joi.number().min(0).max(100).required(),
      text: joi.string().allow('').required(),
      cacheText: joi.string().allow('').required(),
      footnotes: joi.boolean().required(),
      showExample: joi.boolean().required(),
      showFillIns: joi.boolean().required(),
      replacements: joi.array().items(replacementSchema).default([]).required()
    });

    joi.attempt(content, schema, { abortEarly: false, convert: false, noDefaults: true });
  }

  cloneContent(content) {
    return cloneDeep(content);
  }

  redactContent(content, targetRoomId) {
    const redactedContent = cloneDeep(content);

    redactedContent.text = this.gfm.redactCdnResources(
      redactedContent.text,
      url => couldAccessUrlFromRoom(url, targetRoomId) ? url : ''
    );

    return redactedContent;
  }

  getCdnResources(content) {
    return this.gfm.extractCdnResources(content.text);
  }
}

export default GapGeniusInfo;
