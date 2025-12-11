export type CompanyProps = {
  id?: string;
  name: string;
  cnpj?: string;
  createdAt?: Date;
  updatedAt?: Date | null;
};

export class Company {
  private props: CompanyProps;

  constructor(props: CompanyProps) {
    this.props = {
      ...props,
      id: props.id ?? undefined,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? null,
    };
  }

  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get cnpj() {
    return this.props.cnpj;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  rename(newName: string) {
    if (!newName || newName.length < 2) {
      throw new Error("Nome inválido");
    }
    this.props.name = newName;
    this.props.updatedAt = new Date();
  }

  toJSON() {
    return { ...this.props };
  }
}
