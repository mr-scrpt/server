import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

import { UserLogin } from './userLogin.entities';
import { UserContacts } from './userContacts.entities';
import { UserGeneral } from './userGeneral.entities';
import { UserMeta } from './usermeta.entities';

@Schema()
export class User extends Document {
  @Prop({ type: UserGeneral })
  general: UserGeneral;

  @Prop({ type: UserContacts, unique: true, index: true })
  contacts: UserContacts;

  @Prop({ type: UserMeta })
  meta: UserMeta;

  @Prop({ type: UserLogin, unique: true })
  login: UserLogin;
}

export const UserSchema = SchemaFactory.createForClass(User);

/*  UserSchema.path('contacts').validate(async function(value, respond) {
  const User = model('User', UserSchema);
  await User.findOne({ contacts: { email: value } }).exec();
  console.log('-> eee');
  console.log('->  res', res.toJSON());
}, 'Profile ID already exists'); 

UserSchema.pre('save', () => {
  //console.log('-> presave', this.User.contacts);
  const UserModel = model('User', UserSchema);
  UserModel.create().then(doc => {
    console.log(doc);
    //process.exit(0);
  });
  const user = UserModel.findById('5f814846d1fca329a8b4aa7f');
  //console.log('->  user', user);
});
 */
/* UserSchema.save(function(err, foo) {
  console.log(JSON.stringify(foo)); // {"__v":0,"_id":"557ae56480f047fd4ff4ab26","foo":{"bar":{"baz":[]}}}
  Foo.find({ _id: foo._id }, function(err, foos) {
    console.log(JSON.stringify(foos[0])); // {"_id":"557ae56480f047fd4ff4ab26","__v":0,"foo":{"bar":{"baz":[]}}}
  }); 
}); */
/* UserSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
}; */
