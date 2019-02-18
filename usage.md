# Using the Server

You have to first create an account by sending a POST request to `/register` with a body containing email, password, and name fields. The server will respond with a `401` if any of these fields are missing. Otherwise it will respond with a `200` and a JWT token. You will have to put this token on the header of your requests to access the API.

All API requests are sent to `/api`.

# User

You can get information about yourself by sending a GET request to `/api/me`. The server will respond with an object of the following form:

```
{
    email: string,
    name: string,
    income: number,
    goal: {
        funds: number,      // current funds towards goal
        goal: number,       // current goal amount
        due: Date
    }
}
```

> If you just registered and immediately send a GET to `/api/me`, the income and goal fields will not be in the response because they were not set.

Sending a PUT request to `/api/me` allows you to update any of these fields. If it succeeds, it will respond with the updated object.

# Category

Sending a GET request to `/api/ctg` will return **all** of your categories in an array, even if you only have one category:

```
[
    {
        name: string,
        budget: number
    },
    ...
]
```

A POST request to `/api/ctg` will create a new category with the `name` and `budget` fields specified in the request body. These fields are required. If it succeeds, it returns the new category as an **object**:

```
{
    name: string,
    budget: number
}
```

A GET request to `/api/ctg/:id` where `id` is the ID of the category will return just that particular category. You can send a PUT or DELETE request to `/api/ctg/:id` to update or delete the specific category respectively.

# Fixed Expenses

Fixed expenses follow the same conventions as Category except the route is `/api/fe`. A fixed expense object is of the following form:

```
{
    name: string,
    amount: number,
    due: Date,
    payableTo: string
}
```

# Transactions

For Transactions, POST, PUT, DELETE and GET by ID requests follow the same convention as above. The route for transactions is `/api/tr`. The returned Transaction object looks like follows:

```
{
    vendor: string,
    amount: number,
    date: Date,
    category: string
}
```

For GET (many) requests, an optional options object can be added to the request body to 'filter' out the transactions that are returned:

```
options = {
    vendor: string,
    category: string,
    amountRange: [from: number, to: number]
    from: string,
    to: string,
    max: number
}
```

Each field is optional and can be mixed and matched based on the specificity that you require. Explanation of each field follows:

- `vendor` - all transactions with the given vendor
- `category` - all transactions under the given category
- `amountRange` - all transactions where the amount spent is between `from` and `to`. If a 1-length array is passed, the single element is treated as the upper limit `to`.
- `from` - all transactions that occur after the given date string.
- `to` - all transactions that occur before the given date string. Naturally `to` has to come after `from`.
- `max` - the maximum number of transactions to return. It will always return the most recent transactions first.

The returned object has the following form:

```
{
    total: number,
    options: {},
    data: [...]
}
```

Where `total` is the total amount spent in the returned list of transactions and `options` is the options object that was passed in the request. If no `options` object was passed, this will just be an empty object.

> I chose to include `total` in the response because a large portion of the client-side app is determining the total amount spent. Changing this task to the server would remove a significant amount of load from the client-side render functions.
