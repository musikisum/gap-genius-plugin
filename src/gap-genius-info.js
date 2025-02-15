import joi from 'joi';
import React from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import cloneDeep from '@educandu/educandu/utils/clone-deep.js';
import { PLUGIN_GROUP } from '@educandu/educandu/domain/constants.js';
import { couldAccessUrlFromRoom } from '@educandu/educandu/utils/source-utils.js';
import GithubFlavoredMarkdown from '@educandu/educandu/common/github-flavored-markdown.js';

class GapGeniusInfo {
  static dependencies = [GithubFlavoredMarkdown];

  static typeName = 'musikisum/educandu-plugin-gap-genius';

  allowsInput = true;

  constructor(gfm) {
    this.gfm = gfm;
  }

  getDisplayName(t) {
    return t('musikisum/educandu-plugin-gap-genius:name');
  }

  getIcon() {
    return <ClockCircleOutlined />;
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
      analyseText: false,
      replacements: []
    };
  }

  validateContent(content) {
    const replacementSchema = joi.object({
      expression: joi.string().required(),
      index: joi.number().integer().required(),
      list: joi.array().items(joi.string().required()).default([]).required()
    });
    const schema = joi.object({
      width: joi.number().min(0).max(100).required(),
      text: joi.string().allow('').required(),
      analyseText: joi.boolean().required(),
      replacements: joi.array().items(replacementSchema).required()
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
