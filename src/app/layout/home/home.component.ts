import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('routerTransition', [
      state('void', style({})),
      state('*', style({})),
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('0.5s ease-in-out', style({ transform: 'translateY(0%)' }))
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0%)' }),
        animate('0.5s ease-in-out', style({ transform: 'translateY(-100%)' }))
      ])
    ])
  ]
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
