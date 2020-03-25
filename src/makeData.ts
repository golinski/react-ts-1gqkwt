import namor from 'namor'
import _ from 'lodash';

export interface IPerson {
  firstName: string,
    lastName: string,
    age: number,
    visits: number,
    progress: number,
    status: string
}

const newPerson: () => IPerson = () => {
  return {
    firstName: namor.generate({ words: 1, numbers: 0 }),
    lastName: namor.generate({ words: 1, numbers: 0 }),
    age: Math.floor(Math.random() * 30),
    visits: Math.floor(Math.random() * 100),
    progress: Math.floor(Math.random() * 100),
    status: _.sample(["relationship", "complicated", "single"]) as string
  }
}

export default function makeData(n:number) {
  return Array.from({ length: n }, newPerson);
}
