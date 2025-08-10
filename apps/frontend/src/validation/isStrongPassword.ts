export function isStrongPassword() {
  return (field) => {
    const value = field.get();

    if (value?.length < 8) {
      return "Contraseña demasiado débil";
    }

    return null;
  };
}
