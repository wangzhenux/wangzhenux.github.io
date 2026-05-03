interface Modifiers {
  [modifier: string]: boolean;
}

export default class BemBuilder {
  static create(block: string) {
    return new BemBuilder(block);
  }

  static join(...classNames: (string | undefined)[]) {
    return classNames.filter(c => c != null).join(" ");
  }

  private constructor(private blockName: string) {}

  block(modifier?: string, modifierCondition?: boolean) {
    if (modifier != null && modifierCondition !== false) {
      return `${this.blockName} ${this.blockName}--${modifier}`;
    }
    return this.blockName;
  }

  blockMods(modifiers: Modifiers) {
    const base = this.block();

    return [base, ...this.modifiers(base, modifiers)].join(" ");
  }

  element(element: string, modifier?: string, modifierCondition?: boolean) {
    const elementClass = `${this.blockName}__${element}`;
    if (modifier != null && modifierCondition !== false) {
      return `${elementClass} ${elementClass}--${modifier}`;
    }
    return elementClass;
  }

  elementMods(element: string, modifiers: Modifiers) {
    const base = this.element(element);

    return [base, ...this.modifiers(base, modifiers)].join(" ");
  }

  private modifiers(base: string, modifiers: Modifiers) {
    return Object.keys(modifiers)
      .filter(mod => modifiers[mod])
      .map(mod => `${base}--${mod}`);
  }
}
