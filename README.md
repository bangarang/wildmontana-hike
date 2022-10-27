# wildmontana.mapview.io

### Installation and setup

#### Step 1: Install the required packages.
``` bash
npm install
```

#### Step 2: Copy the contents of the `.env.example` file to a new file named `.env`.
``` bash
cp .env.example .env
```

#### Step 3: Update the value for each key in the `.env` file as appropriate.
Note that the `.env` file should never be committed to the git repository as it can contain private
API keys and other sensitive information.

Once the `.env` file has been updated, equivalent key/value pairs should be added as 'config vars'
to the Heroku application via its Settings screen.


### Development and testing

#### Start a development server at `http://localhost:9000`.
``` bash
npm run dev
```

#### Generate a production build.
``` bash
npm run build
```

#### Start a production server at `http://localhost:9000`.
``` bash
npm run start
```
