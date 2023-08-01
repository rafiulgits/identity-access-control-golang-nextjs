export const lastUpdatedOn = (createTime: number, updateTime: number) => {
  if (!updateTime) {
    return new Date(createTime).toLocaleDateString();
  }
  return new Date(updateTime).toLocaleDateString();
};
