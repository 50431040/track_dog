import { ObjectId } from "mongodb";
import { BeforeInsert, Column, Index, ObjectIdColumn } from "typeorm";

export class BaseCreateEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  @Index()
  createTime: number;

  @BeforeInsert()
  onInsert() {
    this.createTime = Date.now();
  }
}
