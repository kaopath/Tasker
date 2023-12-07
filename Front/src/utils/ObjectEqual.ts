// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ObjectsEqual = (obj1: any, obj2: any) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
  
    if (keys1.length !== keys2.length) {
      return false;
    }
  
    for (const key of keys1) {
      const value1 = obj1[key];
      const value2 = obj2[key];
  
      if (value1 !== value2) {
        return false;
      }
    }
    return true;
  };
  
  export { ObjectsEqual };
  