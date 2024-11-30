import { ObjectId } from "mongodb";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Index,
  ObjectIdColumn,
} from "typeorm";

export class BaseEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  @Index()
  createTime: number;

  @Column()
  @Index()
  updateTime: number;

  @BeforeInsert()
  onInsert() {
    const now = Date.now();
    this.createTime = now;
    this.updateTime = now;
  }

  @BeforeUpdate()
  onUpdate() {
    this.updateTime = Date.now();
  }

  get id(): string {
    return this._id.toString();
  }
}
