import * as yup from 'yup';

const seatSchema = yup.object().shape({
  index: yup.number().integer().positive().required(''),
  name: yup.string().required(''),
  visible: yup.boolean().required(),
});

// yup用スキーマ
// TODO: required message!!!!!
const schema = yup.object().shape({
  name: yup.string().required(''),
  column: yup.number().integer().positive().required(''),
  row: yup.number().integer().positive().required(''),
  seats: yup
    .array()
    .of(seatSchema)
    .test('unique', '', (val) => {
      return !val || val.length === new Set(val.map((v) => v.index)).size;
    })
    .required(''),
});

export { schema as ClassLayoutSchema };
