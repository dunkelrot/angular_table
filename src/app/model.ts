export class PipeProperty {
  selected = false;
  constructor(public name: string, public value: string, public unit: string) {}
}

export class PipeData {
  id: string;
  properties: PipeProperty[];

  createProperty(name: string, unit: string) {
    const prop = new PipeProperty(name, '', unit);
    this.properties.push(prop);
  }

  initProps() {
    this.properties = new Array<PipeProperty>();
    this.createProperty('name', '');
    this.createProperty('dn', 'mm');
    this.createProperty('rkz', '');
    this.createProperty('pressure', 'bar');
  }

  setProperty(name: string, value: string) {
    this.properties.forEach(prop => {
      if (prop.name === name) {
        prop.value = value;
      }
    });
  }

  getProperty(name: string): PipeProperty {
    let property: PipeProperty = null;
    this.properties.forEach(prop => {
      if (prop.name === name) {
        property = prop;
      }
    });
    return property;
  }

  getPropertyValue(name: string) {
    let value = '';
    this.properties.forEach(prop => {
      if (prop.name === name) {
        value = prop.value;
      }
    });
    return value;
  }

  getPropertyUnit(name: string) {
    let unit = '';
    this.properties.forEach(prop => {
      if (prop.name === name) {
        unit = prop.unit;
      }
    });
    return unit;
  }

  setName(value: string) {
    this.setProperty('name', value);
  }

  setDN(value: string) {
    this.setProperty('dn', value);
  }

  setRKZ(value: string) {
    this.setProperty('rkz', value);
  }

  isPropSelected(propName: string) {
    let flag = false;
    this.properties.forEach(prop => {
      if (prop.name === propName) {
        flag = prop.selected;
      }
    });
    return flag;
  }
}
