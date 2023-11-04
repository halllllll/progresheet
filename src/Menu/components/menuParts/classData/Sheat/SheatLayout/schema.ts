import * as yup from 'yup';

const seatSchema = yup.object().shape({
  index: yup.number().integer().positive().required(''),
  name: yup.string().required(''),
  visible: yup.boolean().required(),
});

// yup用スキーマ
// TODO: required message!!!!!
const schema = yup.object().shape({
  name: yup.string().min(3, '3文字以上必要です').required('3文字以上必要です'),
  column: yup.number().integer().positive().required(''),
  row: yup.number().integer().positive().required(''),
  seats: yup
    .array()
    .of(seatSchema)
    .min(1, '1つ以上必要です')
    .test('unique', 'each indicies must be unique. ', (val) => {
      return !val || val.length === new Set(val.map((v) => v.index)).size;
    })
    .required(''),
});

export { schema as ClassLayoutSchema };
