import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DialogComponent } from '../dialog/dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface PeriodicElement {
  hidden: boolean;
  name: string;
  actions: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Hydrogen', actions: 1.0079, hidden: true },
  { name: 'Helium', actions: 4.0026, hidden: true },
  { name: 'Lithium', actions: 6.941, hidden: true },
  { name: 'Beryllium', actions: 9.0122, hidden: true },
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  fileNumber!: FormGroup;
  title = 'Angular13Crud';
  addtext = '';
  editingIndex!: number ;
  textAddArray: any[] = [];
  displayedColumns: string[] = [
    'name',
    'address',
    'city',
    'state',
    'zipcode',
    'phone',
    'email',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  isEditing!: boolean;

  constructor(private dialog: MatDialog, private api: ApiService,private fb:FormBuilder) { this.fileNumber =  this.fb.group({
    addtext:['',Validators.required]
  })}
  

  ngOnInit(): void {
    this.getAllOrder();
  }

  openDialog() {
    this.dialog
      .open(DialogComponent, {
        width: '30%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllOrder();
        }
      });
  }

  textAdd() {
    if (this.isEditing) {
      this.textAddArray[this.editingIndex] = this.addtext;
      this.addtext = '';
      this.isEditing = false;
    } else {
      this.textAddArray.push(this.addtext);
      this.addtext = '';
    }
  }


  getAllOrder() {
    this.api.getOrder().subscribe({
      next: (res: any[] | undefined) => {
        //console.log(res);
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      // error: (_err: any) => {
      //   alert('Error while fetching the record!');
      // },
    });
  }

  editOrder(row: any) {
    this.dialog
      .open(DialogComponent, {
        width: '30%',
        data: row,
      })
      .afterClosed()
      .subscribe((val: string) => {
        if (val === 'update') {
          this.getAllOrder();
        }
      });
  }

  deleteOrder(id: number) {
    this.api.deleteOrder(id).subscribe({
      next: (res) => {
        alert('order deleted successfully');
        this.getAllOrder();
      },
      // error: (_err) => {
      //   // alert('Error while deleting the record!');
      // },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }




// Assuming this is your array of texts

editForm(index: number) {
    this.isEditing = true;
    this.editingIndex = index;
    this.addtext = this.textAddArray[index];
}

// You can have a method to save the edited text
saveText() {
    this.textAddArray[this.editingIndex] = this.addtext;
    this.isEditing = false;
}

// And a method to cancel the editing process
cancelEdit() {
    this.isEditing = false;
}
}
