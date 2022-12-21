# Copied from https://github.com/ansible/ansible/issues/17329#issuecomment-731281767
class FilterModule(object):
    def filters(self):
        return {"not_falsy": self.not_falsy}

    def not_falsy(self, input):
        if not input:
            raise Exception('"Falsy" values not allowed.')

        return input
