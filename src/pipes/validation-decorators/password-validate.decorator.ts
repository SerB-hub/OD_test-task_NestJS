import {registerDecorator, ValidationArguments, ValidationOptions} from "class-validator";


export function IsStrongPassword(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isStrongPassword',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments): Promise<boolean> | boolean {
                    const characterArray = String(value).split('');
                    let numberCounter = 0;
                    let lowercaseCounter = 0;
                    let uppercaseCounter = 0;
                    characterArray.forEach(char => {
                        if (!isNaN(Number(char))) {
                            numberCounter++;
                        } else {
                            if (char.match(/[A-ZА-Я]/gi)) {
                                if (char === char.toLowerCase()) {
                                    lowercaseCounter++;
                                }
                                if (char === char.toUpperCase()) {
                                    uppercaseCounter++;
                                }
                            }
                        }
                    })
                    return (
                        numberCounter > 0 &&
                        lowercaseCounter > 0 &&
                        uppercaseCounter > 0
                    )
                }
            }
        })
    }
}