```typescript
@Controller()
class SomeController {
  @useHook()
  getData(@Deps id: number | string) {
    
  }
}

const useHook = ({}):MethodDecorator => (target, propertyKey, descriptor) => {
  const origin = descriptor.value; 
  
  const depsData = Reflect.getMetadata('useHook:deps', target, propertyKey);
  
  target[`use${propertyKey}`] = (...args: any[]) => {
    const deps = args.reduce((r, arg, i) => {
      if (depsData[i]) {
        r.push(arg);
      }
      return r;
    }, [])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    
    useEffect(() => {
      setLoading(true);
      setError(undefined);
      
      const r = origin();
      if (r instanceof Promise) {
        r
          .then(_ => setLoading(false))
          .catch(e => {
          setError(e);
          setLoading(false);
        });
      } else {
        setLoading(false)
      }
    }, deps);
    
    return { error, loading };
  }
}

const someCotroller = new SomeController();

someCotroller.getData();
const { loading, error } = someCotroller.useGetData();

const {} = someStore.hooks.useState('key', 'key2');


```
