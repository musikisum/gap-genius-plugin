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
      replacements: {}
    };
  }

  validateContent(content) {
    const schema = joi.object({
      width: joi.number().min(0).max(100).required(),
      text: joi.string().allow('').required(),
      replacements: joi.object().pattern(
        joi.string(),
        joi.array().items(joi.string().optional())
      ).required()
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
