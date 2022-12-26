import { View, Button } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Text, Input } from '../../../shared/ui';

const LoginForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
  });
  const onSubmit = data => console.log(data);

  return (
    <View>
      <Input variant={'underlined'} placeholder="Email" mb={2} />
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            variant={'underlined'}
            placeholder="Email"
            mb={2}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="firstName"
      />
      {errors.firstName && <Text>This is required.</Text>}

      <Controller
        control={control}
        rules={{
          maxLength: 100,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input variant={'underlined'} onBlur={onBlur} onChangeText={onChange} value={value} />
        )}
        name="lastName"
      />

      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

export { LoginForm };
