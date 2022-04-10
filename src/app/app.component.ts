import { ApiService } from './services/api.service';
import { DialogComponent } from './dialog/dialog.component';
import { Component, AfterViewInit, ViewChild } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Angular13Crud';

  displayedColumns: string[] = ['productName', 'category', 'date', 'freshness', 'price', 'comment', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor (private dialog :MatDialog, private api: ApiService) {}

  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '35%'
    }).afterClosed().subscribe(val=>{
      if(val==='save'){
        this.getAllProducts()
      }
    });
  }

  getAllProducts() {
    this.api.getProduct().subscribe({
      next: (res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort
      },
      error: ()=>{
        console.log("error !!");
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editProduct(row : any) {
    this.dialog.open(DialogComponent, {
      width: '35%',
      data: row
    }).afterClosed().subscribe(val=>{
      if(val==='update'){
        this.getAllProducts()
      }
    });
  }

  deleteProduct(id : number) {
    this.api.deleteProduct(id).subscribe({
      next: (res)=>{
        alert('Product deleted successfully');
        this.getAllProducts()
      } ,
      error: ()=>{alert('Error while deleting the product')}
    })
  }

  ngOnInit() {
    this.getAllProducts();
  }
  
}
