export const modules = ["vendor", "customer", "product"]

export const permissions = [
  {
    value: "c",
    key: "c",
    label: "create"
  },
  {
    value: "r",
    "key": "r",
    label: "read",

  }, {
    value: "u",
    key: "u",
    label: "update"

  }, {
    value: "d",
    key: "d",
    label: "delete"

  }
]

export const permissionRecord: Record<string, string> = {
  "c": "create", "r": "read", "u": "update", "d": "delete", "create": "c", "read": "r", "update": 'u', "delete": "d"
}


export const authProviders = [
  "credential", "google", "microsoft"
]