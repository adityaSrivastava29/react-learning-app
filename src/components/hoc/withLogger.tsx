import React, { useEffect } from "react";

// HOC that logs component props and lifecycle events
function withLogger<T extends object>(
  WrappedComponent: React.ComponentType<T>
) {
  return function LoggerComponent(props: T) {
    useEffect(() => {
      console.log(`🔍 [Logger HOC] Component mounted with props:`, props);

      return () => {
        console.log(`🔍 [Logger HOC] Component will unmount`);
      };
    }, [props]);

    useEffect(() => {
      console.log(`🔍 [Logger HOC] Props updated:`, props);
    });

    return <WrappedComponent {...props} />;
  };
}

export default withLogger;
