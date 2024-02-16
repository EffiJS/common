export function $NameDTO(data) {
  return {
    get _origin() {
      return data;
    },
    get id() {
      return data?.id;
    },
  };
}
