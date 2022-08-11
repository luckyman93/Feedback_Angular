import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/shared/refreshers/theme.service';
import { ThemeSwitcherService } from 'src/app/shared/services/theme-switcher.service';

@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.scss'],
})
export class ThemeSwitcherComponent implements OnInit {
  lightTheme: any = '';
  darkTheme: any = '';
  lightThemeName: any = '';
  darkThemeName: any = '';

  previewTheme: any = '';
  previewMode: any = '';
  activeCardLightTheme: boolean = true;
  activeCardDarkTheme: boolean = true;

  themesLightList = [
    { name: 'Atom Light', value: 'atom-theme' },
    { name: 'Solarized Light', value: 'solarized-theme' },
    { name: 'Tokyo Light', value: 'tokyo-theme' },
  ];

  themesDarkList = [
    { name: 'Atom Dark', value: 'atom-theme' },
    { name: 'Atom Dark 2', value: 'atom-theme-2' },
    { name: 'Solarized Dark', value: 'solarized-theme' },
    { name: 'Tokyo Dark', value: 'tokyo-theme' },
  ];

  constructor(
    private themeRefresher: ThemeService,
    public themeService: ThemeSwitcherService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('activeDarkTheme') === 'atom-theme') {
      this.darkTheme = 'atom-theme';
      this.darkThemeName = 'Atom Dark';
    } else if (localStorage.getItem('activeDarkTheme') === 'atom-theme-2') {
      this.darkTheme = 'atom-theme-2';
      this.darkThemeName = 'Atom Dark 2';
    } else if (localStorage.getItem('activeDarkTheme') === 'solarized-theme') {
      this.darkTheme = 'solarized-theme';
      this.darkThemeName = 'Solarized Dark';
    } else if (localStorage.getItem('activeDarkTheme') === 'tokyo-theme') {
      this.darkTheme = 'tokyo-theme';
      this.darkThemeName = 'Tokyo Dark';
    }

    if (localStorage.getItem('activeLightTheme') === 'atom-theme') {
      this.lightTheme = 'atom-theme';
      this.lightThemeName = 'Atom Light';
    } else if (localStorage.getItem('activeLightTheme') === 'solarized-theme') {
      this.lightTheme = 'solarized-theme';
      this.lightThemeName = 'Solarized Light';
    } else if (localStorage.getItem('activeLightTheme') === 'tokyo-theme') {
      this.lightTheme = 'TokyoLight';
      this.lightThemeName = 'tokyo-theme';
    }

    this.lightThemeName = localStorage.getItem('activeLightThemeName');
    this.darkThemeName = localStorage.getItem('activeDarkThemeName');
  }

  showPreview(theme: any, mode: any): void {
    this.previewTheme = theme;
    this.previewMode = mode;
    if (mode === 'light') {
      this.activeCardLightTheme = false;
    } else if (mode === 'dark') {
      this.activeCardDarkTheme = false;
    }
  }
  hidePreview(): void {
    this.previewTheme = '';
    this.previewMode = '';
    this.activeCardLightTheme = true;
    this.activeCardDarkTheme = true;
  }

  chooseLightTheme(theme: any): void {
    this.lightTheme = theme.value;
    this.lightThemeName = theme.name;

    localStorage.setItem('selected-theme', theme.value);
    localStorage.setItem('activeLightTheme', theme.value);
    localStorage.setItem('activeLightThemeName', theme.name);
    localStorage.setItem('themeMode', 'light');

    this.themeService.selectedTheme = theme.value;
    this.themeService.themeMode = 'light';

    this.themeRefresher.setMessage('theme changes');
  }

  chooseDarkTheme(theme: any): void {
    this.darkTheme = theme.value;
    this.darkThemeName = theme.name;

    localStorage.setItem('selected-theme', theme.value);
    localStorage.setItem('activeDarkTheme', theme.value);
    localStorage.setItem('activeDarkThemeName', theme.name);
    localStorage.setItem('themeMode', 'dark');

    this.themeService.selectedTheme = theme.value;
    this.themeService.themeMode = 'dark';

    this.themeRefresher.setMessage('theme changes');
  }
}
