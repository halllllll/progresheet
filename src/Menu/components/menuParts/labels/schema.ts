import * as yup from 'yup';

// yup用スキーマ
const schema = yup
  .object()
  .shape({
    labels: yup
      .array()
      .of(
        yup
          .object()
          .shape({
            value: yup.string().required('ラベル名をいれてね'),
            color: yup.string().required('色を決めよう！'),
          })
          .required('埋めよう！')
      )
      .min(2)
      .required('2つ以上必要です'),
  })
  .required('不正だよ！');

// export type LabelSchema = yup.InferType<typeof schema>;

export { schema as LabelSchema };
