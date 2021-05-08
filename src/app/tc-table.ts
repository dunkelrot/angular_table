import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EditDialog } from './edit-dlg';
import { PipeData, PipeProperty } from './model';
import { PropSelection } from './selection';

function shortToPropName(name: string): string {
  let result = name;
  if (name === 'pn') {
    result = 'pressure';
  }
  return result;
}

/**
 */
@Component({
  selector: 'tc-table',
  styleUrls: ['tc-table.css'],
  templateUrl: 'tc-table.html'
})
export class TcTable implements AfterViewInit {
  displayedColumns: string[] = ['name', 'dn', 'rkz', 'pressure'];
  dataSource: MatTableDataSource<PipeData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  selection = new PropSelection();

  constructor(public dialog: MatDialog) {
    // Create 50 pipes
    const pipes = Array.from({ length: 25 }, (_, k) => createNewPipe(k + 1));

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(pipes);
    this.dataSource.filterPredicate = (
      data: PipeData,
      value: string
    ): boolean => {
      const tokens = value.split('=');
      if (tokens.length === 1) {
        return data.getPropertyValue('name').search(value) != -1;
      } else {
        return data.getPropertyValue(shortToPropName(tokens[0])).search(tokens[1]) != -1;
      }
    };
    this.dataSource.sortingDataAccessor = (
      data: PipeData, id: string
    ) => {
      return data.getPropertyValue(id);
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onSelect(pipeData: PipeData, propName: string) {
    this.selection.toggleProperty(pipeData.getProperty(propName));
  }

  onSelectAll(propName: string, flag: boolean) {
    const startIndex = this.dataSource.paginator.pageIndex * this.dataSource.paginator.pageSize;
    
    let endIndex = this.dataSource.paginator.pageIndex * this.dataSource.paginator.pageSize + this.dataSource.paginator.pageSize;
    endIndex = endIndex > this.dataSource.filteredData.length ? this.dataSource.filteredData.length : endIndex;

    for (var index = startIndex; index < endIndex; index++) {
      const pipeData = this.dataSource.filteredData[index];
      const prop = pipeData.getProperty(propName);
      this.selection.selectProperty(prop, !prop.selected);
    };
  }

  onSelectMouseEnter(pipeData: PipeData, propName: string, event: MouseEvent) {
    if (event.ctrlKey) {
      this.selection.selectProperty(pipeData.getProperty(propName), true);
    } else if (event.shiftKey) {
      this.selection.selectProperty(pipeData.getProperty(propName), false);
    }
  }

  onEdit() {
    if (this.selection.count() > 0) {
      const propTypes = this.selection.getPropTypes();
      const propValues: PipeProperty[] = [];
      propTypes.forEach(pt => {
        propValues.push(new PipeProperty(pt.name, '', pt.unit));
      });
      const dialogRef = this.dialog.open(EditDialog, {
        width: '400px',
        data: {
          propValueList: propValues
        }
      });
      dialogRef.afterClosed().subscribe((result: PipeProperty[]) => {
        result.forEach(propValue => {
          this.selection.apply(propValue.name, (prop: PipeProperty) => {
            prop.value = propValue.value;
          });
        });
        this.selection.clear();
      });
    }
  }

  onClearSelection() {
    this.selection.clear();
  }
}

function getPipePressure() {
  return Math.round(Math.random() * 5 + 1) * 5;
}

function getPipeDN() {
  return Math.round(Math.random() * 9 + 1) * 10;
}

function getPipeNumber() {
  return Math.round(Math.random() * 99) * 10;
}

function getRKZNumber() {
  return Math.round(Math.random() * 9) * 100;
}

/** Builds and returns a new User. */
function createNewPipe(id: number): PipeData {
  const name = getPipeNumber() + '.' + getPipeNumber();
  const pipeData = new PipeData();
  pipeData.id = id.toString();
  pipeData.initProps();
  pipeData.setName(name);
  pipeData.setRKZ(getRKZNumber().toString());
  pipeData.setDN(getPipeDN().toString());
  pipeData.setProperty('pressure', getPipePressure().toString());
  return pipeData;
}
