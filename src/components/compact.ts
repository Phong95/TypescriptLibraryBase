const __compact = (array: any[]): any[] => {
    return array.filter((item) => !!item);
}
export { __compact };