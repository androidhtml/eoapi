import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'eo-page-feature-preview',
  templateUrl: './page-feature-preview.component.html',
  styleUrls: ['./page-feature-preview.component.scss'],
})
export class PageFeaturePreviewComponent implements OnInit {
  constructor() {}
  version = '1.0.3';
  downloadList = [
    {
      id: 'win',
      name: 'Windows 客户端',
      icon: 'windows',
      keyword: 'Setup',
      suffix: 'exe',
      link: '',
    },
    {
      id: 'mac',
      name: 'macOS(Intel) 客户端',
      icon: 'apple',
      suffix: 'dmg',
      link: '',
    },
    {
      id: 'mac',
      name: 'macOS(M1) 客户端',
      icon: 'apple',
      suffix: 'arm64.dmg',
      link: '',
    },
  ];
  ngOnInit(): void {}
}
