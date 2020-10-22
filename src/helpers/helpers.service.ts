import { ConflictException, Injectable } from '@nestjs/common';

type UniqueFieldsType = {
  name: string;
  value: string;
}
@Injectable()
export class HelpersService {
  aliasGenerator(str: string): string {
    const ru = new Map([
      ['а', 'a'], ['б', 'b'], ['в', 'v'], ['г', 'g'], ['д', 'd'], ['е', 'e'],
      ['є', 'e'], ['ё', 'e'], ['ж', 'j'], ['з', 'z'], ['и', 'i'], ['ї', 'yi'], ['й', 'i'],
      ['к', 'k'], ['л', 'l'], ['м', 'm'], ['н', 'n'], ['о', 'o'], ['п', 'p'], ['р', 'r'],
      ['с', 's'], ['т', 't'], ['у', 'u'], ['ф', 'f'], ['х', 'h'], ['ц', 'c'], ['ч', 'ch'],
      ['ш', 'sh'], ['щ', 'shch'], ['ы', 'y'], ['э', 'e'], ['ю', 'u'], ['я', 'ya'], [' ', '-']
    ]);

    str = str.replace(/[ъь]+/g, '');

    return Array.from(str)
      .reduce((s: string, l: string) =>
        s + (
          ru.get(l)
          || ru.get(l.toLowerCase()) === undefined && l
          || ru.get(l.toLowerCase())
        )
        , '');
  }

  async isUniqueField(fieldsToCheck: Array<UniqueFieldsType>, model): Promise<void> {

    await Promise.all(fieldsToCheck.map(async (item: UniqueFieldsType) => {
      const doc = await model.findOne({
        [item.name]: item.value
      })
      console.log("-> doc!1", doc);
      if (doc) {
        throw new ConflictException(`Duplicate "${item.name}" data`);
      }
    }))
  }
}
