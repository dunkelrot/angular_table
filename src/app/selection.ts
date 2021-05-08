import { PipeProperty } from "./model";

type CompareRemoveFrom<T, M> = (entry: T, key: M) => boolean;

export interface PropType {
  name: string;
  unit: string;
}

function removeFromArray<T, M>(
  array: T[],
  dropIn: M,
  compare: CompareRemoveFrom<T, M>
): void {
  let index = -1;
  array.forEach((entry, ii) => {
    if (compare(entry, dropIn)) {
      index = ii;
    }
  });
  if (index !== -1) {
    array.splice(index, 1);
  } else {
    console.log("NO REMOVED");
  }
}

interface ISelectMod<T, U> {
  (property: T): U;
}

export class PropSelection {
  selectedProps: Map<string, PipeProperty[]> = new Map();

  selectProperty(property: PipeProperty, flag: boolean) {
    if (!flag) {
      this.removeFromSelection(property);
    } else {
      this.addToSelection(property);
    }
  }

  selectProperties(properties: PipeProperty[], flag: boolean) {
    properties.forEach(prop => {
      this.selectProperty(prop, flag);
    });
  }

  toggleProperty(property: PipeProperty) {
    this.selectProperty(property, !property.selected)
  }

  removeFromSelection(property: PipeProperty) {
    if (property.selected) {
      property.selected = false;
      removeFromArray(this.selectedProps.get(property.name), property, (a, b) => {
        return a === b;
      });
    }
  }

  addToSelection(property: PipeProperty) {
    if (!property.selected) {
      property.selected = true;
      let propList = this.selectedProps.get(property.name);
      if (propList === undefined) {
        propList = new Array<PipeProperty>();
        this.selectedProps.set(property.name, propList);
      }
      propList.push(property);
    }
  }

  countPropNames() {
    return this.selectedProps.keys.length;
  }

  countSelectedPropByName(name: string) {
    return this.selectedProps.get(name).length;
  }

  clear() {
    this.selectedProps.forEach(propList => {
      propList.forEach(prop => {
        prop.selected = false;
      });
    });
    this.selectedProps.clear();
  }

  count() {
    let count = 0;
    this.selectedProps.forEach(propList => {
      count = count + propList.length;
    });
    return count;
  }

  getPropNames() {
    let names = [];
    let it = this.selectedProps.keys();
    let name = it.next();
    while (!name.done) {
      names.push(name.value);
      name = it.next();
    }
    return names;
  }

  getPropTypes(): PropType[] {
    let names: PropType[] = [];
    this.selectedProps.forEach((propList, name) => {
      if (propList.length > 0) {
        names.push({ name: name, unit: propList[0].unit });
      }
    });
    return names;
  }

  apply(name: string, func: ISelectMod<PipeProperty, any>) {
    this.selectedProps.get(name).forEach(prop => {
      func(prop);
    });
  }
}
