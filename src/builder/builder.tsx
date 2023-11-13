function MyComponentBuilder() {
  const props: any = {};

  const withText = (text: any) => {
    props.text = text;
    return myComponentBuilder;
  };

  const withClass = (className: any) => {
    props.className = className;
    return myComponentBuilder;
  };

  const withColor = (color: { r: number; g: number; b: number }) => {
    props.color = color;
    return myComponentBuilder;
  };

  const withSize = (size: string) => {
    props.size = size;
    return myComponentBuilder;
  };

  const build = () => {
    return <MyComponent {...props} />;
  };

  const myComponentBuilder = {
    withText,
    withColor,
    withSize,
    build,
    withClass,
  };

  return myComponentBuilder;
}

function MyComponent(props: any) {
  const { text, color, size, className } = props;

  return (
    <h5
      className={className}
      style={{ color: `rgb(${color.r},${color.g},${color.b})`, fontSize: size }}
    >
      {text}
    </h5>
  );
}

export { MyComponent, MyComponentBuilder };
