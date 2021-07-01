import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  benefitsWolox = [
    {
      icon: '../../../assets/Ic_Hour.svg',
      text: 'general.FlexibleHours'
    },
    {
      icon: '../../../assets/Ic_HomeOffice.svg',
      text: 'general.HomeOffice'
    },
    {
      icon: '../../../assets/Ic_Workshops.svg',
      text: 'general.Workshops'
    },
    {
      icon: '../../../assets/Ic_DrinkSnacks.svg',
      text: 'general.DrinkSnacks'
    },
    {
      icon: '../../../assets/Ic_laptop.svg',
      text: 'general.RemoteWork'
    },
    {
      icon: '../../../assets/Ic_Tecnologys.svg',
      text: 'general.CuttingEdgeTechnologies'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
