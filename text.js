function SelectOptionField(props) {
  const { options } = props;
  const optionValues = isArray(options) ? options : keys(options);
  const optionLabels = isArray(options) ? options : values(options);
  
  return (
    <TextField
      className={props.className}
      InputProps={props.InputProps}
      styles={props.styles}
      key={props.idx}
      select
      SelectProps={{ multiple: props.multiple ?? false }}
      size="small"
      label={props.label}
      name={props.name}
      value={props.value}
      onChange={props.update(props.idx, props.name)}
    >
      {map(optionValues, (choice, idx) => (
        <MenuItem key={idx} value={choice} style={{ color: 'black' }}>
          {optionLabels[idx]}
        </MenuItem>
      ))}
    </TextField>
  );
}