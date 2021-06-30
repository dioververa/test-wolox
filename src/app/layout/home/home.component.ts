import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  benefits = [
    {
      icon: '../../../Ic_Hour.svg',
      text: 'general.FlexibleHours'
    },
    {
      icon: '../../../Ic_HomeOffice.svg',
      text: 'general.HomeOffice'
    },
    {
      icon: '../../../Ic_Workshops.svg',
      text: 'general.Workshops'
    },
    {
      icon: '../../../Ic_DrinkSnacks.svg',
      text: 'general.DrinkSnacks'
    },
    {
      icon: '../../../Ic_laptop.svg',
      text: 'general.RemoteWork'
    },
    {
      icon: '../../../Ic_Tecnologys.svg',
      text: 'general.CuttingEdgeTechnologies'
    }
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
