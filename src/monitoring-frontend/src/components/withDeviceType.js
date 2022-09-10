function withDeviceType(
  WrappedComponent,
  deviceType = { value: "Device", label: "Device" }
) {
  return (props) => {
    return <WrappedComponent deviceType={deviceType} {...props} />;
  };
}

export default withDeviceType;
