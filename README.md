# Carmu API

Customer data, cash movements, invoicing and statistics are managed via a RESTful API developed using Express and TypeScript. It provides robust and efficient CRUD operations, ensuring scalability and data security.

## Dependencies

![Express](https://user-images.githubusercontent.com/50376585/190275778-8c1f44dc-aad3-4776-b8df-30fbd218de8f.png)![Mongoose](https://user-images.githubusercontent.com/50376585/190275791-576a74f6-4251-4479-9a28-2393b2309eb1.png)![JWT](https://user-images.githubusercontent.com/50376585/190276105-48680784-aff8-47e3-af91-b82dfe9a33fd.png)![bcrypt](https://user-images.githubusercontent.com/50376585/190279827-5fb8525d-b45a-4bb3-81b5-4e5755413c5a.jpeg)![busboy](https://user-images.githubusercontent.com/50376585/190279838-2757a98b-caa9-4026-9494-ef47174411b6.png)![cloudinary](https://user-images.githubusercontent.com/50376585/190279842-ab1352f7-25a5-49d8-9e86-eaec857c3fb8.png)![cors](https://user-images.githubusercontent.com/50376585/190279844-b31e6be6-77de-4cc5-b2e2-38d99bfc765a.jpg)![dotenv](https://user-images.githubusercontent.com/50376585/190279846-d3c63d4d-8330-4190-bf3d-f52309994626.png)![Morgan-npm](https://user-images.githubusercontent.com/50376585/190280006-97572dfa-a325-432f-b84b-6a21cecf503e.png)

## Dev Dependencies

This project use the next dependencies for dev

| Dependencie         | Description                    |
| ------------------- | ------------------------------ |
| Eslint              | Use Eslint with standard rules |
| Prettier            | For format the style code      |
| Husky & lint-staged | For control the pre-commit     |

## Installation

1. Clone this repository `git clone https://github.com/Zuniga63/carmu-api.git`
2. Install the dependencies with node `pnpm install`
3. Create the .env file with `cp .env.example .env`
4. Write the credentials to the file **.env**
5. After adding Cloudinary credentials run the script for create the presets `pnpm run presets`
6. Finished for dev run `npm run dev` and for production `npm run start`

## Diagram Model

[![CarmuProject drawio](https://user-images.githubusercontent.com/50376585/194598117-13f5bfec-fb8d-48d4-80c6-c6a22eb6af8c.svg)](https://drive.google.com/file/d/122_Lb7Mxaz_KzhNN6k6xW_32uyB0su5e/view?usp=sharing)

Relationship entity diadram of the models used for the API, the entities in green are implemented.

## API Documentation

swagger-ui-express is used for endpoint documentation and can be found in the "/api-docs" path.

![carmu-api-doc](https://user-images.githubusercontent.com/50376585/194599871-1b3315c2-afed-450d-aa66-c7016c8a7ff0.gif)
