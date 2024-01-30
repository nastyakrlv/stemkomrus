import {Component, ElementRef, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ICatalog, IItem, ISizes} from "../types/catalog.interface";
import {URL} from "../../constants";
import {CommonModule, UpperCasePipe} from "@angular/common";
import {MatButtonToggle, MatButtonToggleGroup, MatButtonToggleModule} from '@angular/material/button-toggle';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MainService} from "../main.service";


@Component({
  selector: 'app-item',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent implements OnInit {
  public url: string;
  public itemForm!: FormGroup;
  public filtredItems: ISizes[]=[];
  public isDis: boolean = true;

  @Input({transform: (value: ICatalog | IItem) => value as IItem}) item?: IItem;
  @ViewChildren('toggle') toggles!: QueryList<MatButtonToggle>;

  constructor(
    private formBuilder : FormBuilder,
    private _mainService: MainService
  ) {
    this.url = URL;

  }

  ngOnInit(): void {
    if (this.item?.sizes) {
      const formControls: { [key: string]: FormControl } = {};
      this.item.sizes.forEach((size: ISizes) => {
        formControls[size.size_name] = new FormControl('', Validators.required);
      });
      this.itemForm = this.formBuilder.group(formControls);


      this.filtredItems.push(this.item.sizes[0])


    }

  }

  public onAddToCart(): void {
    console.log(this.itemForm);
  }

  public onSizeChange(sizeName: string, selectedValue: any, contain: string) {
    this._mainService.getFilteredItem(this.item!.name, { [sizeName]: selectedValue })
      .subscribe((filteredItem: ISizes | null) => {
        const existingIndex = this.filtredItems.findIndex(item => item.size_name === sizeName);
        if (existingIndex !== -1) {
          this.filtredItems.splice(existingIndex+1, this.filtredItems.length - existingIndex);
          const formValues = this.itemForm.value;
          const formKeys = Object.keys(formValues);
          for (let i = existingIndex + 1; i < formKeys.length; i++) {
            formValues[formKeys[i]] = '';
          }
          this.itemForm.patchValue(formValues);
        }
        this.filtredItems.push(filteredItem!)




    });
  }

  isSizeAvailable(sizeName: string, size: string): boolean {
    let ok: boolean = false;
    this.filtredItems.forEach((item) => {
        if (item.size_name === sizeName) {
          item.contain_sizes.forEach((item_size) => {
            if (item_size.toString() === size.toString()) {
              ok = true;
            }
          })
        }
      }
    )
    return ok;
  }


}
