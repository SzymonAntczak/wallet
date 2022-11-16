import mongoose from 'mongoose';

interface WalletAttrs {
  name: string;
  ownerId: string;
}

interface WalletDoc extends mongoose.Document {
  name: string;
  ownerId: string;
  // createdAt: string;
}

interface WalletModel extends mongoose.Model<WalletDoc> {
  build(attrs: WalletAttrs): WalletDoc;
}

const walletSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ownerId: {
      type: String,
      required: true,
    },
    // createdAt: {
    //   type: String,
    //   required: true,
    // },
  },
  {
    toJSON: {
      versionKey: false,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

walletSchema.statics.build = (attrs: WalletAttrs) => {
  return new Wallet(attrs);
};

const Wallet = mongoose.model<WalletDoc, WalletModel>('Wallet', walletSchema);

export { Wallet };
