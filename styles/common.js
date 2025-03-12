import { StyleSheet } from 'react-native'

export const baseStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    fontSize: 18,
    width: '100%',
    borderColor: '#CCCCCC',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
})

export const utilityStyles = {
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
}

export const commonStyles = {
  icon: {
    height: 90,
    width: 90,
    padding: 10,
  },
  numberSelection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
  },
  numberInput: {
    fontSize: 20,
    height: 50,
    width: 50,
    borderColor: '#CCCCCC',
    backgroundColor: '#FAFAFA',
    color: '#111111',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 10,
    marginTop: 5,
  },
  numberButton: {
    padding: 15,
  },
  kindSelection: {
    height: 70,
    marginTop: 15,
  },
  kindInput: {
    height: 50,
  },
  kindInputText: {
    fontSize: 18,
  },
  categorySelection: {
    height: 180,
  },
}
