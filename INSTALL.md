
### Install devDependencies for @Decorators
```yarn
yarn add -D babel-plugin-transform-typescript-metadata @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties babel-plugin-parameter-decorator
```

`babel-plugin-transform-typescript-metadata` - using metadata in TS
`@babel/plugin-proposal-decorators` - can use decorators (method and property)
`@babel/plugin-proposal-class-properties` - can use class decorators 
`babel-plugin-parameter-decorator` - can use parameter decorator in class methods

```json 
// .babelrc
{
  "plugins": {
    "babel-plugin-transform-typescript-metadata",
    [ "@babel/plugin-proposal-decorators", { legacy: true }],
    [ "@babel/plugin-proposal-class-properties", {legacy: true}],
  }
}
```





!!! Was in package.json
@babel/preset-env @babel/preset-typescript @types/jest @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-airbnb-base eslint-config-airbnb-typescript eslint-config-prettier eslint-plugin-import eslint-plugin-prettier jest prettier ts-jest tsc-alias typescript
