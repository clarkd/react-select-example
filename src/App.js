import './App.css';
import AsyncCreatableSelect from 'react-select/async-creatable';
import AsyncSelect from 'react-select/async';
import { createFilter } from 'react-select';

const spec1 = { // Example for a fixed list, non-creatable - e.g. region selection
  creatable: false,
  options: 'fixed',
  fixedOptions: ['us-east-1', 'us-east-2', 'us-west-1', 'us-west-2']
};

const spec2 = { // Example for remote list, non-creatable
  creatable: false,
  options: 'remote',
  remoteOptions: 'datastream-cloudwatch-namespaces-list'
};

const spec3 = { // Example for cloudwatch metrics, creatable to support new metric names
  creatable: true,
  options: 'remote',
  remoteOptions: 'datastream-cloudwatch-metrics'
};

const getDatastream = async (name) => {
  switch(name) {
    case 'datastream-cloudwatch-namespaces-list':
      return ['Lambda', 'EC2', 'S3'];
    case 'datastream-cloudwatch-metrics':
      return ['Duration', 'Executions', "Errors", 'Bucket Size', 'Requests', '4xx', 'CPU', 'Memory', 'Disk']
    default:
      throw new Error('Unrecognised stream');
  }
}

function Autocomplete({ config }) {
  /**
   * Example function to fetch options
   * These could com
   * @param {string} inputValue 
   * @returns 
   */
  const promiseOptions = (inputValue) => {
    if(config.options === 'remote') {
      return new Promise(async (resolve) => {
        setTimeout(() => {
          getDatastream(config.remoteOptions).then((options) => {
            resolve(options.map(s => ({label: s, value: s})));
          });
        }, 3000);
      });
    } else if(config.options === 'fixed') {
      return new Promise((r) => {
        r(config.fixedOptions.map(s => ({label: s, value: s})));
      })
    }    
  };

  const Component = config.creatable ? AsyncCreatableSelect : AsyncSelect;
  return <Component loadOptions={promiseOptions} cacheOptions defaultOptions filterOption={createFilter()}  />;
}

function App() {
  return (
    <div className="App">
      <h1>Spec 1</h1>
      <p>Example for fixed list, non-creatable</p>
      <pre>
        {JSON.stringify(spec1, null, '\t')}
      </pre>
      <Autocomplete config={spec1} />
      <h1>Spec 2</h1>
      <p>Example for remote list, non-creatable</p>
      <pre>
        {JSON.stringify(spec2, null, '    ')}
      </pre>
      <Autocomplete config={spec2} />
      <h1>Spec 3</h1>
      <p>Example for cloudwatch metrics, creatable to support new metric names</p>
      <pre>
        {JSON.stringify(spec3, null, '    ')}
      </pre>
      <Autocomplete config={spec3} />
      </div>
  );
}

export default App;
