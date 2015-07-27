# salary360initiumdatacom

## Dependencies for Backend (Data Processing)

* Python3
* Then get the dependencies in virtualenv

## Dependencies for Frontend

Install the virtualisation suite:

* VirtualBox
* Vagrant

Launch the image:

```
vagrant up
```

Login the virtual machine and run server:

```
vagrant ssh
cd /vagrant
grunt serve
```

Then visit 
<http://localhost:9000/>

## About Data

Data is from HK Census 2011, gazetteer.hk project

Run the preparation script in the following path to generate API data:
(already checked in the repo)

```
app/api/census2011
```
