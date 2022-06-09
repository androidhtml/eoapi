import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { tree2obj } from 'eo/workbench/browser/src/app/utils/tree/tree.utils';
import { ApiData, ApiMockEntity, StorageRes, StorageResStatus } from '../../../../shared/services/storage/index.model';

@Component({
  selector: 'eo-api-detail-mock',
  templateUrl: './api-detail-mock.component.html',
  styleUrls: ['./api-detail-mock.component.scss'],
})
export class ApiDetailMockComponent implements OnChanges {
  @Input() apiData: ApiData;
  mockUrl = window.eo?.getMockUrl?.() || location.origin;
  mocklList: ApiMockEntity[] = [];
  listConf: object = {};
  isVisible = false;
  mockListColumns = [
    { title: '名称', key: 'name' },
    { title: 'URL', slot: 'url' },
  ];
  constructor(private storageService: StorageService, private route: ActivatedRoute) {}

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    const { apiData } = changes;
    if (apiData.currentValue?.uuid) {
      const apiDataID = Number(this.apiData.uuid);
      console.log('apiDataID', this.apiData, apiDataID);
      const mockRes = await this.getMockByApiDataID(apiDataID);
      if (window.eo?.getMockUrl && Array.isArray(mockRes) && mockRes.length === 0) {
        const mock = this.createMockObj({ name: '系统默认期望', isDefault: true });
        const res = await this.createMock(mock);
        res.data.url = this.getApiUrl(res.data.uuid);
        this.mocklList = [res.data];
      } else {
        this.mocklList = mockRes;
      }
    }
  }
  getApiUrl(uuid?: number) {
    const url = new URL(this.apiData.uri, this.mockUrl);
    uuid && url.searchParams.set('mockID', uuid + '');
    return url.toString();
  }
  /**
   * get mock list
   *
   * @param apiDataID
   * @returns
   */
  getMockByApiDataID(apiDataID: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storageService.run('apiMockLoadAllByApiDataID', [apiDataID], (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          resolve(result.data);
        } else {
          reject(result);
        }
      });
    });
  }

  /**
   * create mock
   * @param mock
   * @returns
   */
  createMock(mock): Promise<StorageRes> {
    return new Promise((resolve, reject) => {
      this.storageService.run('mockCreate', [mock], (res: StorageRes) => {
        if (res.status === StorageResStatus.success) {
          resolve(res);
        } else {
          reject(res);
        }
      });
    });
  }

  /**
   * create mock object data
   * @param options
   * @returns
   */
  createMockObj(options: Record<string, any> = {}) {
    const { name = '', isDefault = false, ...rest } = options;
    return {
      name,
      url: this.getApiUrl(),
      apiDataID: this.apiData.uuid,
      projectID: 1,
      isDefault,
      response: JSON.stringify(tree2obj([].concat(this.apiData.responseBody))),
      ...rest,
    };
  }
}
