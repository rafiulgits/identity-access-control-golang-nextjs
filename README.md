Identity & Access Control

There should be 2 types of users

- Admin: who can actually create permission policies, assign policy/permission/access to standard users
- Standard: who can basically login into the system and can only operate assigned functions only

Modules:

System has predefined modules: Vendor, Customer, Product. Basic CRUD operations should be available in the system

Domain Models

```typescript
interface Customer extends Log {
  id: number;
  name: string;
  code: string;
  phone: string;
  address: string;
}

interface Vendor extends Log {
  id: number;
  name: string;
  code: string;
  phone: string;
  address: string;
}

interface Product extends Log {
  id: number;
  name: string;
  code: string;
  price: number;
}

interface Permission extends Log {
  id: number;
  policyId: numebr;
  module: string;
  access: number; // int8
}

interface Policy extends Log {
  id: number;
  name: string;
  permissions: Permission[];
}
```

bitwise operation

```go
package main

import "fmt"

// Constants representing CRUD permissions as bits
const (
    CreatePermission = 8 // 2^3
    ReadPermission   = 4 // 2^2
    UpdatePermission = 2 // 2^1
    DeletePermission = 1 // 2^0
)

// Function to check if a given permission exists in the CRUD bitmask
func hasPermission(crud, permission int) bool {
    return (crud & permission) != 0
}

func main() {
    // Sample CRUD values
    crud1 := 15 // 1111 (All permissions)
    crud2 := 4  // 0100 (Read only)

    // Checking for CRUD permissions
    fmt.Printf("CRUD 1 - Create: %v, Read: %v, Update: %v, Delete: %v\n",
        hasPermission(crud1, CreatePermission),
        hasPermission(crud1, ReadPermission),
        hasPermission(crud1, UpdatePermission),
        hasPermission(crud1, DeletePermission))

    fmt.Printf("CRUD 2 - Create: %v, Read: %v, Update: %v, Delete: %v\n",
        hasPermission(crud2, CreatePermission),
        hasPermission(crud2, ReadPermission),
        hasPermission(crud2, UpdatePermission),
        hasPermission(crud2, DeletePermission))
}

```

Then make a middleware to check every operation access.

User Login:

A user can connect social login with account. In signup time user can choose how to signup, then can integrate multiple social login. Then user can use any of them to authenticate.

A User <-> Multiple Account

```typescript
interface User {
  id: number;
  name: string;
  accounts: Account[];
}

interface Account {
  id: number;
  userId: number;
  authProvider: string; // google, microsoft, credential
  name: string; // email, phone or google email/id or something
  secret: string; // optional --> could be password or OAuth session id or something
}
```

User --> Policy map

```typescript
interface UserPolicy {
  userId: number; // pk, sk
  policyId: number; // pk, sk
}
```

---

Roadmap

- allow signin or not in user model
- optional accounts array in user creation
