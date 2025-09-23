/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import {describe, it, expect, vi, afterEach} from 'vitest';
import identifyPlatform from '../identifyPlatform';
import {Platform} from '../../models/platforms';
import {Config} from '../../models/config';

vi.mock('../logger', () => ({default: {debug: vi.fn(), warn: vi.fn()}}));

describe('identifyPlatform', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return Platform.Asgardeo for recognized asgardeo domains', () => {
    const configs: Config[] = [
      {baseUrl: 'https://api.asgardeo.io/t/org', clientId: '', applicationId: ''},
      {baseUrl: 'https://accounts.asgardeo.io/t/org', clientId: '', applicationId: ''},
      {baseUrl: 'https://asgardeo.io/t/org', clientId: '', applicationId: ''},
    ];

    configs.forEach(config => {
      expect(identifyPlatform(config)).toBe(Platform.Asgardeo);
    });
  });

  it('should return Platform.IdentityServer for non-asgardeo recognized base Urls', () => {
    const configs: Config[] = [
      {baseUrl: 'https://localhost:9443/t/carbon.super', clientId: '', applicationId: ''},
      {baseUrl: 'https://is.dev.com/t/abc.com', clientId: '', applicationId: ''},
      {baseUrl: 'https://192.168.1.1/t/mytenant', clientId: '', applicationId: ''},
    ];

    configs.forEach(config => {
      expect(identifyPlatform(config)).toBe(Platform.IdentityServer);
    });
  });

  it('should return Platform.IdentityServer if baseUrl is not recognized', () => {
    const config: Config = {baseUrl: undefined, clientId: '', applicationId: ''};

    expect(identifyPlatform(config)).toBe(Platform.Unknown);
  });

  it('should return Platform.IdentityServer if baseUrl is malformed', () => {
    const config: Config = {baseUrl: 'http://[::1', clientId: '', applicationId: ''};

    expect(identifyPlatform(config)).toBe(Platform.Unknown);
  });
});
