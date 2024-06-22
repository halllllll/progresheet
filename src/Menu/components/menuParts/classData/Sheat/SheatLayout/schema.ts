import * as yup from 'yup';

const REQUIED_SIMPLE_NOTATION = '入力必須です';

const seatSchema = yup.object().shape({
  index: yup.number().integer().positive().required(REQUIED_SIMPLE_NOTATION),
  name: yup
    .string()
    .trim()
    .matches(
      /^(?:(?![*:\\/?\\[\]"'`;|]).)*$/,
      '使用できない文字が含まれています'
    )
    .max(30, '30文字以内です'),
  // .required(REQUIED_SIMPLE_NOTATION),
  visible: yup.boolean().required(REQUIED_SIMPLE_NOTATION),
});

// yup用スキーマ
const schema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .matches(
      /^(?:(?![*:\\/?\\[\]"'`;|]).)*$/,
      '使用できない文字が含まれています'
    )
    .min(3, '3文字以上必要です')
    .max(30, '30文字以内です')
    .required(REQUIED_SIMPLE_NOTATION),
  column: yup.number().integer().positive().required(REQUIED_SIMPLE_NOTATION),
  row: yup.number().integer().positive().required(REQUIED_SIMPLE_NOTATION),
  seats: yup
    .array()
    .of(seatSchema)
    .min(1, '1つ以上必要です')
    .test('unique', 'each indicies must be unique. ', (val) => {
      return !val || val.length === new Set(val.map((v) => v.index)).size;
    })
    .required(REQUIED_SIMPLE_NOTATION),
});

export { schema as ClassLayoutSchema };
