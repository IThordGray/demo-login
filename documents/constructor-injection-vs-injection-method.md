# Dependency injection

Angular uses Dependency Injection which is a software design pattern that deals with how components get hold of their
dependencies. The Angular injector subsystem is responsible for creating components, resolving their dependencies, and
providing them to other components as requested.

## Constructor injection

Imagine we have a service that needs to make an HTTP request. We can inject the HttpClient service into the constructor
of the service like so:

```typescript
import { HttpClient } from '@angular/common/http';

class SomeService {
  constructor(
    private _http: HttpClient
  ) {
  }

  getSomething() {
    return this._http.get('https://example.com');
  }
}
```

This is probably the most common way to inject content in Angular. It's called constructor injection.

Personally I prefer not to use constructor injection for two main reasons.

1. Readability: The constructor is somewhere under all the properties and accessor methods. Depending on the size of the
   file, it can be hard to find. It also makes the constructor look messy.
2. Extensibility: If you need to inject another dependency, you need to add it to the constructor. If this class is
   extended on, it means you need to add the dependency to the constructor of the derived class as well. Depending on
   how often this service is extended, it can become a maintenance nightmare e.g.

```typescript
import { HttpClient } from '@angular/common/http';

class DerivedService extends SomeService {
  constructor(
    _http: HttpClient
  ) {
    super(_http);
  }
}
```

## Injection method

Instead of injecting the dependency in the constructor, we can inject it in a method. Angular exposed the `inject`
method to be used. There is also the `@Inject` decorator that can be used, but this more cumbersome. Depending on ESLint
rules, it might also complain in the latter that _http is not initialised.

```typescript
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

class SomeService {
  private readonly _http = inject(HttpClient);

  getSomething() {
    return this._http.get('https://example.com');
  }
}
```

or

```typescript
import { HttpClient } from '@angular/common/http';
import { Inject } from '@angular/core';

class SomeService {
  @Inject(HttpClient) private readonly _http: HttpClient;

  getSomething() {
    return this._http.get('https://example.com');
  }
}
```

Both these address the issues mentioned above.
1. Readability: Assuming my _private readonly_ properties are always at the top of the class, it's easy to find the
   injected dependencies.
2. Extensibility: If the class is extended, it's no longer necessary to add dependencies to the derived class.
