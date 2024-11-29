
Docker hub page https://hub.docker.com/repository/docker/shellking4/shorty-master/general

In the project we have customised Pocketbase endpoints by using a main.go as described in their doc (use as framework)

We also have pb_hooks/url_shortner.pb.js which is the javascript counterpart of the go customization logic.

This is to offer two possible ways. If you don't want to build a custom binary using the main.go and go build -o pocketbase, you can still launch the project as is and the pb_hooks will add the url shortner endpoints and logic for you.

The main reason why I finally added the js hooks is to be able to deploy to PocketHost which does not support using custom binary for security sake.
